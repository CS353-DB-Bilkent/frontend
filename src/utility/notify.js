import { Store } from 'react-notifications-component';
import ERROR_CODES from '../constants/errorCodes';
import NOTIFY_TYPES from '../constants/notifyTypes';

export function notify(title, type, message = '') {
  Store.addNotification({
    title,
    message,
    type,
    insert: 'bottom',
    container: 'bottom-left',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 4000,
      pauseOnHover: true,
      onScreen: true,
    },
    slidingExit: {
      duration: 400,
      timingFunction: 'ease-out',
      delay: 0,
    },
    touchSlidingExit: {
      swipe: {
        duration: 400,
        timingFunction: 'ease-out',
        delay: 0,
      },
      fade: {
        duration: 400,
        timingFunction: 'ease-out',
        delay: 0,
      },
    },
  });
}

export function notifyError(data) {
  notify(data?.result?.message, NOTIFY_TYPES.ERROR);

  if (data?.result?.code === ERROR_CODES.VALIDATION_FAILED) {
    data.result.errors.forEach((error) => {
      if (error !== '') notify(error, NOTIFY_TYPES.ERROR);
    });
  }
}
