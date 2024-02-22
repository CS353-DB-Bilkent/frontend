import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from '../ErrorPage';
import { notifyError } from '../../utility/notify';

export default function ReactErrorBoundary(props) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorPage}
      onError={(error, errorInfo) => {
        notifyError(error);
      }}
    >
      {props.children}
    </ErrorBoundary>
  );
}
