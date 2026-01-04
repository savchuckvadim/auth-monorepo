import { ProfileDto, UpdateProfileDto } from "@workspace/nest-api";
import { getProfile } from "@workspace/nest-api";
import { customAxios } from "@workspace/nest-api/src/lib/back-api";

const $api = getProfile();

export class ProfileService {
    static async getProfile(): Promise<ProfileDto> {
        return await $api.profileGetMyProfile() as ProfileDto;
    }

    static async updateProfile(profile: UpdateProfileDto): Promise<ProfileDto> {
        return await $api.profileUpdateMyProfile(profile) as ProfileDto;
    }

    static async getProfileById(id: string): Promise<ProfileDto> {
        return await $api.profileGetProfileById(id) as ProfileDto;
    }

    static async getProfileByUserId(userId: string): Promise<ProfileDto> {
        return await $api.profileGetProfileByUserId(userId) as ProfileDto;
    }

    static async uploadAvatar(file: File): Promise<ProfileDto> {
        const formData = new FormData();
        formData.append('file', file);

        return await customAxios<ProfileDto>({
            url: '/api/profile/me/avatar',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        }) as ProfileDto;
    }

    static async uploadHero(file: File): Promise<ProfileDto> {
        const formData = new FormData();
        formData.append('file', file);

        return await customAxios<ProfileDto>({
            url: '/api/profile/me/hero',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        }) as ProfileDto;
    }
}
