'use client'
import Link from "next/link"
import x from '@/styles/app.module.css'
import Appbody from '@/components/app.body'
import { setBlogToSearch } from '@/app/Redux/blogSlice';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

type Blog = {
  id: number,
  title: string,
  author: string,
  content: string,
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const BlogToSearch = useSelector((state: any) => state.blog.blogToSearch);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (BlogToSearch) {
          response = await fetch(`http://localhost:8000/blogs?content=${BlogToSearch}`);
        } else {
          response = await fetch('http://localhost:8000/blogs');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BlogToSearch]);

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
      </div>
      <Appbody
        blogs={blogs?.sort((a: any, b: any) => b.id - a.id)} />
    </div>
  )
}