const Copyright = () => {
  return (
    <div className="bg-muted border-t border-border py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              © {new Date().getFullYear()}
            </span>
            <span className="font-semibold">Yonela Sibene</span>
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-2xl">
            All content, projects, and materials on this portfolio are original works. 
            Unauthorized reproduction, modification, or distribution is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Copyright;