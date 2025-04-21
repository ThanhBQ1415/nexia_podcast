'use client'
import { ToastContainer, toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    setShowModalCreate,
    setUpdateModal, 
    setDeleteModal,
    setBlogToDelete,
    setBlogToEdit
} from '@/app/Redux/blogSlice';

interface IProps {
    blogs: IBlog[]
}

function DarkExample(props: IProps) {
    const { blogs } = props;
    const dispatch = useDispatch();
    const router = useRouter();
    
    const { 
        showModalCreate,
        updateModal,
        deleteModal,
        blogToDelete,
        blogToEdit 
    } = useSelector((state: any) => state.blog);

    const handleDeleteClick = (blog: IBlog) => {
        dispatch(setBlogToDelete(blog));
        dispatch(setDeleteModal(true));
    };

    const handleEditClick = (blog: IBlog) => {
        dispatch(setBlogToEdit(blog));
        dispatch(setUpdateModal(true));
    }

    return (
        <div className='container px-4 mx-auto mt-8'>
            <div className='mb-6'>
                <h3 className='text-2xl font-bold text-blue-600'>Blog Management</h3>
            </div>

            <div className='bg-white rounded-lg shadow-lg'>
                <div className='p-6'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase'>#</th>
                                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Title</th>
                                <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Author</th>
                                <th className='px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase'>Actions</th>
                            </tr>
                        </thead>    
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {blogs?.map(blog => (
                                <tr key={blog.id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 text-sm text-center text-gray-500'>{blog.id}</td>
                                    <td className='px-6 py-4 text-sm text-gray-900'>{blog.title}</td>
                                    <td className='px-6 py-4 text-sm text-gray-900'>{blog.author}</td>
                                    <td className='px-6 py-4 text-center'>
                                        <button 
                                            className='inline-flex items-center px-3 py-2 mr-2 text-sm font-medium text-blue-600 bg-white rounded-md border border-blue-300 hover:bg-blue-50'
                                            onClick={() => dispatch(setShowModalCreate(true))}
                                            title="Add Blog"
                                        >
                                            Add
                                        </button>
                                        <button 
                                            className='inline-flex items-center px-3 py-2 mr-2 text-sm font-medium text-yellow-600 bg-white rounded-md border border-yellow-300 hover:bg-yellow-50'
                                            onClick={() => handleEditClick(blog)}
                                            title="Edit Blog"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className='inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-white rounded-md border border-red-300 hover:bg-red-50'
                                            onClick={() => handleDeleteClick(blog)}
                                            title="Delete Blog"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

       
            <button 
                className="px-4 py-2 mt-4 font-semibold text-white bg-red-600 rounded-md transition duration-200 hover:bg-red-700"
                onClick={() => router.push('/blog')}
            >
                di
            </button>
        </div>
    );
}

export default DarkExample;