'use client';
import { BreadcrumbEllipsis, BreadcrumbItem } from "@workspace/ui/components/breadcrumb"
import { useDeletePost } from "../../../lib/hook/post.hook";
import { PostDto } from "@workspace/nest-api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";

export const PostManage = ({ post }: { post: PostDto }) => {
    const deletePostMutation = useDeletePost();
    const handleDeletePost = () => {
        deletePostMutation.mutate(post.id);
    }

    return (
        <div className='text-foreground flex items-start gap-2 ' style={{
            cursor: 'pointer',
        }}>
            <BreadcrumbItem
                className='flex items-center gap-1 hover:text-primary '

                onClick={handleDeletePost}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                        <BreadcrumbEllipsis className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className='rounded-xl p-2'>
                        <DropdownMenuItem className='cursor-pointer' onClick={handleDeletePost}>Delete</DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </BreadcrumbItem>
        </div>
    )
}
