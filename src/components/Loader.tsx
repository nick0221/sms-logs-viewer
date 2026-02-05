function CenteredLoader({ label }: { label: string }) {
  return (
    <div className="flex flex-1 min-w-0 text-gray-400 font-semibold">
      <div className="w-screen flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        <span className="ml-2 text-sm">{label}</span>
      </div>
    </div>
  );
}

export default CenteredLoader;
