import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-[24px]">
          <div className="text-center max-w-[480px]">
            <div className="inline-flex items-center justify-center w-[72px] h-[72px] bg-red-100 rounded-full mb-[24px]">
              <AlertTriangle className="w-[36px] h-[36px] text-red-500" />
            </div>
            <h1 className="text-[28px] font-bold text-foreground mb-[12px]">
              Something went wrong
            </h1>
            <p className="text-[15px] text-muted-foreground mb-[32px]">
              An unexpected error occurred. Please reload the page or contact
              support if the problem persists.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-[8px] px-[24px] py-[12px] bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white font-semibold rounded-[12px] hover:from-[#1D4ED8] hover:to-[#6D28D9] transition-all shadow-lg shadow-blue-500/25"
            >
              <RefreshCw className="w-[18px] h-[18px]" />
              Reload Page
            </button>
            {this.state.error && (
              <details className="mt-[24px] text-left">
                <summary className="text-[13px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  Error Details
                </summary>
                <pre className="mt-[8px] p-[16px] bg-[#1E293B] text-[#F8D7DA] text-[12px] rounded-[8px] overflow-auto max-h-[200px]">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
