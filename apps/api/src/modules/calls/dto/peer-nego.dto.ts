export class PeerNegoNeededDto {
  to: string;
  offer: RTCSessionDescriptionInit;
}

export class PeerNegoDoneDto {
  to: string;
  ans: RTCSessionDescriptionInit;
}

