import Pusher from 'pusher';

export interface PusherProps {
  appId: string
  key: string
  secret: string
}

export const getPusherInstance = (props: PusherProps): Pusher => {

  return new Pusher({
    cluster: '',
    appId: props.appId,
    key: props.key,
    secret: props.secret,
    host: '127.0.0.1',
    useTLS: true
  });
};