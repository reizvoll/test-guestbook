const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-gray-300 border-t-gray-900 tb:h-8 tb:w-8 mb:h-6 mb:w-6"></div>
    </div>
  );
};

export default LoadingSpinner;
