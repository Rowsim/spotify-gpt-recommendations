import { useContext, useEffect } from "react"
import { AppContext } from "../../AppContext"

export const Toast = () => {
    const { toast, setToastWithExpiry } = useContext(AppContext);
    useEffect(() => {
        setToastWithExpiry({
            message: 'Test message!Test message!',
            error: false,
            ttlMs: 5000
        })
    }, [])

    return (
        <>
            {!toast ? null :
                <div className="flex justify-center absolute bottom-4 w-full">
                    <div className={`flex items-center w-full max-w-xs p-4 space-x-4 text-white divide-x divide-gray-200 rounded-lg shadow" role="alert ${toast?.error ? 'bg-red-600' : 'bg-spotify-green'}`}>
                        {toast?.error ?
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                            </svg>
                            : <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                        }
                        <div className="pl-4 text-sm font-normal">{toast?.message}</div>
                    </div>
                </div>
            }
        </>
    )
}