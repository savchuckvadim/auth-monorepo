import { Button } from '@workspace/ui/components/button';
import Image from 'next/image'


export default function ProfileInformation() {
    return (
        <div className="relative w-full  mx-auto border rounded-3xl overflow-hidden bg-card shadow-md">
            {/* Верхняя часть с фоном */}
            <div className="relative h-[250px] sm:h-[300px]">
                <Image
                    src="/logo.svg"
                    alt="profile hero"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Аватар */}
            <div className="absolute top-[230px] sm:top-[300px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-white font-bold text-xl">JD</span>
            </div>

            {/* Основной контент */}
            <div className="flex flex-col items-center text-center mt-16 px-6 pb-6">
                <h2 className="text-mainBackground font-bold text-2xl mb-2">Jane D Mary</h2>
                <p className="text-gray-600 text-sm mb-4">
                    Идейные соображения высшего порядка, а также внедрение современных методик предопределяет высокую востребованность кластеризации усилий.
                </p>

                {/* Статистика */}
                <div className="flex justify-between w-full max-w-md mb-6">
                    <div className="flex flex-col items-center">
                        <p className="text-mainBackground font-bold text-md">1</p>
                        <p className="text-gray-500 text-sm">Posts</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-mainBackground font-bold text-md">1</p>
                        <p className="text-gray-500 text-sm">Following</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-mainBackground font-bold text-md">1</p>
                        <p className="text-gray-500 text-sm">Followers</p>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="flex flex-wrap gap-4 justify-center w-full">
                    <Button
                        className="w-full sm:w-[48%] h-[50px]"
                        onClick={() => console.log('follow')}
                        variant="default"
                    >
                        Follow
                    </Button>
                    <Button
                        className="w-full sm:w-[48%] h-[50px]"
                        onClick={() => console.log('send message')}
                        variant="outline"
                    >
                        Send Message
                    </Button>
                </div>
            </div>
        </div>
    );
}
