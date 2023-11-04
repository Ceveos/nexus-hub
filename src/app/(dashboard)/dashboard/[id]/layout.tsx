"use client"
import { useEffect, type ReactNode } from "react";
import { useDispatch } from "~/store/hooks";
import { decrementComponentListener, incrementComponentListener } from "~/store/slices/pusherSlice";

const ServerLayout = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!dispatch) {return}
        dispatch(incrementComponentListener({
            appKey: 'app-key'
        }));

        return () => {
            dispatch(decrementComponentListener({
                appKey: 'app-key'
            }));
        }
    }, [dispatch]);
    return (
        <>
            {children}
        </>
    );
};

export default ServerLayout;
