type Client = {
  id: string;
  controller: ReadableStreamDefaultController;
};

type Lock = {
  leadId: string;
  clientId: string;
  userEmail: string;
};

// In development, Next.js hot reloads can clear module scope.
// Storing active clients and locks on the global object prevents loss on reload.
let globalClients = (global as any).realtimeClients as Client[] | undefined;
if (!globalClients) {
  globalClients = [];
  (global as any).realtimeClients = globalClients;
}

let globalLocks = (global as any).realtimeLocks as Lock[] | undefined;
if (!globalLocks) {
  globalLocks = [];
  (global as any).realtimeLocks = globalLocks;
}

export function registerClient(id: string, controller: ReadableStreamDefaultController) {
  if (globalClients) {
    globalClients.push({ id, controller });
    console.log(`[Realtime] Client registered: ${id}. Active connections: ${globalClients.length}`);
  }
}

export function unregisterClient(id: string) {
  if (globalClients) {
    const index = globalClients.findIndex((c) => c.id === id);
    if (index !== -1) {
      globalClients.splice(index, 1);
      console.log(`[Realtime] Client unregistered: ${id}. Active connections: ${globalClients.length}`);
    }
  }
  // Release editing locks held by this client when they disconnect
  releaseClientLocks(id);
}

export function broadcast(event: string, data: any) {
  if (!globalClients || globalClients.length === 0) return;

  const encoder = new TextEncoder();
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  const encoded = encoder.encode(message);

  console.log(`[Realtime] Broadcasting event '${event}' to ${globalClients.length} clients.`);

  const clientsCopy = [...globalClients];
  clientsCopy.forEach((client) => {
    try {
      client.controller.enqueue(encoded);
    } catch (err) {
      console.warn(`[Realtime] Error writing to client ${client.id}. Removing client.`);
      unregisterClient(client.id);
    }
  });
}

// Lock Registry Helpers
export function getLocks() {
  return globalLocks || [];
}

export function acquireLock(leadId: string, clientId: string, userEmail: string): boolean {
  if (!globalLocks) return false;
  
  // Clear any previous locks held by this specific client (except this new leadId)
  releaseClientLocks(clientId, leadId);

  const existingLock = globalLocks.find((l) => l.leadId === leadId);
  if (existingLock) {
    // If already locked by the same client tab, count as success
    if (existingLock.clientId === clientId) return true;
    return false; // Locked by another client/user
  }

  globalLocks.push({ leadId, clientId, userEmail });
  console.log(`[Realtime] Lock acquired on lead ${leadId} by ${userEmail} (${clientId})`);
  return true;
}

export function releaseLock(leadId: string, clientId: string): boolean {
  if (!globalLocks) return false;
  const initialLength = globalLocks.length;
  
  (global as any).realtimeLocks = globalLocks.filter(
    (l) => !(l.leadId === leadId && l.clientId === clientId)
  );
  globalLocks = (global as any).realtimeLocks;
  
  const released = (globalLocks?.length ?? 0) < initialLength;
  if (released) {
    console.log(`[Realtime] Lock released on lead ${leadId} by client ${clientId}`);
  }
  return released;
}

export function releaseClientLocks(clientId: string, exceptLeadId?: string) {
  if (!globalLocks) return;
  
  const locksToRelease = globalLocks.filter(
    (l) => l.clientId === clientId && l.leadId !== exceptLeadId
  );
  
  locksToRelease.forEach((lock) => {
    console.log(`[Realtime] Releasing disconnected lock on lead ${lock.leadId}`);
    broadcast("lead_unlocked", { leadId: lock.leadId });
  });

  (global as any).realtimeLocks = globalLocks.filter(
    (l) => !(l.clientId === clientId && l.leadId !== exceptLeadId)
  );
  globalLocks = (global as any).realtimeLocks;
}
