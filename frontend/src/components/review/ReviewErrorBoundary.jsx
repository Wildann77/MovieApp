import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ReviewErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Review Error Boundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Review System Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <AlertTriangle className="w-12 h-12 text-red-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">
                                Something went wrong with the review system.
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                {this.state.error?.message || 'An unexpected error occurred'}
                            </p>
                            <Button 
                                onClick={this.handleRetry}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}

export default ReviewErrorBoundary;
