import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // You can integrate with error reporting services like Sentry here
      console.error('Production Error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      const { 
        fallback: FallbackComponent, 
        showDetails = false,
        title = 'Something went wrong',
        description = 'An unexpected error occurred. Please try again.',
        retryText = 'Try Again'
      } = this.props;

      // Use custom fallback component if provided
      if (FallbackComponent) {
        return (
          <FallbackComponent 
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            retry={this.handleRetry}
          />
        );
      }

      return (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <IconAlertTriangle className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{description}</p>
            
            {showDetails && this.state.error && (
              <details className="text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details
                </summary>
                <pre className="bg-muted p-3 rounded-md overflow-auto text-xs">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
              >
                <IconRefresh className="h-4 w-4 mr-2" />
                {retryText}
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                variant="default"
                size="sm"
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
