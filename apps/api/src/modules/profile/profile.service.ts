import { Injectable } from "@nestjs/common";
import { ProfileRepository } from "./profile.repository";
import { UpdateProfileDto, ProfileDto } from "./profile.dto";

@Injectable()
export class ProfileService {
    constructor(
        private readonly repo: ProfileRepository,
    ) { }

    public async getProfileByUserId(userId: string): Promise<ProfileDto> {
        return new ProfileDto(await this.repo.findByUserId(userId));
    }

    public async getProfileById(id: string): Promise<ProfileDto> {
        return new ProfileDto(await this.repo.findById(id));
    }

    public async createProfile(userId: string): Promise<ProfileDto> {
        return new ProfileDto(await this.repo.create(userId));
    }

    public async updateProfile(userId: string, data: UpdateProfileDto): Promise<ProfileDto> {
        return new ProfileDto(await this.repo.update(userId, data));
    }
}

