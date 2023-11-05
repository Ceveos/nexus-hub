"use client";

import { useEffect } from "react";
import { useDispatch } from "~/store/hooks";
import { decrementComponentListener, incrementComponentListener } from "~/store/slices/pusherSlice";


export default function WebsocketTest() {
    const dispatch = useDispatch();
    useEffect(() => {
        if (!dispatch) { return }
        dispatch(incrementComponentListener({
            appKey: 'app-key'
        }));

        return () => {
            dispatch(decrementComponentListener({
                appKey: 'app-key'
            }));
        }
    }, [dispatch]);


    return <></>
}
