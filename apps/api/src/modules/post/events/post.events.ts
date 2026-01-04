import { PostDto } from "../dto/post.dto";

export class PostCreatedEvent {
    constructor(public readonly post: PostDto) { }
}

export class PostUpdatedEvent {
    constructor(public readonly post: PostDto) { }
}

export class PostDeletedEvent {
    constructor(public readonly postId: string) { }
}

export class PostLikedEvent {
    constructor(
        public readonly postId: string,
        public readonly userId: string,
        public readonly isLike: boolean,
    ) { }
}
