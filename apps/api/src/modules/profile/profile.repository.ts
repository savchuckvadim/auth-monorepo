import { Profile } from 'generated/prisma';
import { UpdateProfileDto } from './profile.dto';

export abstract class ProfileRepository {
    abstract findByUserId(userId: string): Promise<
        Profile & {
            followersCount: number;
            followingCount: number;
            postsCount: number;
        }
    >;
    abstract create(userId: string): Promise<Profile>;
    abstract update(userId: string, data: UpdateProfileDto): Promise<Profile>;
    abstract findById(id: string): Promise<
        Profile & {
            followersCount: number;
            followingCount: number;
            postsCount: number;
        }
    >;
}
