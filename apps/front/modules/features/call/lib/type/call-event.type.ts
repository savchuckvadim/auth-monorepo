export enum CallEvent {
    INITIATE = 'call:initiate',
    INCOMING = 'call:incoming',
    ACCEPTED = 'call:accepted',
    END = 'call:end',
    INITIATED = 'call:initiated',
    PEER_NEGO_NEEDED = 'peer:nego:needed',
    PEER_NEGO_FINAL = 'peer:nego:final',
    PEER_ICE_CANDIDATE = 'peer:ice-candidate',
}

