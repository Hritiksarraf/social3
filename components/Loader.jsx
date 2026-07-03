const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div
        className="w-11 h-11 rounded-2xl -rotate-3 animate-yv-breathe flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #7857FF, #FF0073)",
          boxShadow: "0 16px 30px -12px rgba(120,87,255,0.8)",
        }}
      >
        <div className="flex gap-[3px] items-end h-4">
          <span className="w-1 bg-white rounded-sm animate-yv-eq" style={{ height: 8, animationDelay: "0s" }} />
          <span className="w-1 bg-white rounded-sm animate-yv-eq" style={{ height: 16, animationDelay: "0.15s" }} />
          <span className="w-1 bg-white rounded-sm animate-yv-eq" style={{ height: 11, animationDelay: "0.3s" }} />
        </div>
      </div>
    </div>
  );
}

export default Loader;
