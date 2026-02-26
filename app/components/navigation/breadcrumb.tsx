import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'

export default function Breadcrumb({ to = "back", href }: { to?: string, href?: string }) {
    const navigate = useNavigate();

    return (
        <section className='p-1 pe-3 max-w-max rounded-full flex items-center gap-3 border border-gray-200 overflow-x-auto'>
            <Link
                to={href ? href : ""}
                onClick={href ? undefined : () => navigate(-1)}
                aria-label='Go back'
                className='flex items-center gap-1 font-bold text-xs cursor-pointer tranisition hover:bg-gray-600 hover:text-white bg-gray-200 px-2 py-1 text-primary rounded-full capitalize transition relative focus:top-px focus:border-b'
            >
                <ArrowLeft className='inline-block' size={14} strokeWidth={3}/>
                <span className='text-nowrap'>{href ? (to) : ("Back")}</span>
            </Link>

            <nav aria-label="Breadcrumb" className='overflow-x-hidden'>
                <ol className="flex items-center space-x-2 text-xs">
                    {window.location.pathname
                        .split('/')
                        .filter(Boolean)
                        .map((segment, idx, arr) => {
                            const path = '/' + arr.slice(0, idx + 1).join('/');
                            const isLast = idx === arr.length - 1;

                            return (
                                <li key={path} className="flex items-center text-nowrap capitalize">
                                    {!isLast ? (
                                        <>
                                            <Link
                                                to={path}
                                                className="text-gray-500 hover:text-primary transition animated fadeIn"
                                            >
                                                {decodeURIComponent(segment.replace(/-/g, ' '))}
                                            </Link>
                                            <span className="ms-2 text-gray-400">/</span>
                                        </>
                                    ) : (
                                        <span className="text-gray-700 font-semibold">
                                            {decodeURIComponent(segment.replace(/-/g, ' '))}
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                </ol>
            </nav>
        </section>
    )
}
