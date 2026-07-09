export default function GalleryLoading() {
  // We'll generate an array of dummy items with fixed spans to mimic the masonry layout
  // 12 items is a good amount to fill a large desktop screen
  const skeletons = Array.from({ length: 12 }).map((_, i) => {
    let colSpan = "col-span-1";
    let rowSpan = "row-span-1";
    
    // Simulate the dense grid logic
    if (i === 0 || i === 7) {
      colSpan = "md:col-span-2";
      rowSpan = "row-span-2";
    } else if (i === 3 || i === 10) {
      colSpan = "col-span-2";
      rowSpan = "row-span-1";
    } else if (i === 5 || i === 11) {
      colSpan = "col-span-1";
      rowSpan = "row-span-2";
    }

    return { colSpan, rowSpan };
  });

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-16 min-h-screen">
      <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
        <div className="h-12 md:h-16 w-48 bg-black/5 animate-pulse mx-auto rounded-lg mb-6"></div>
        <div className="h-6 md:h-8 w-3/4 bg-black/5 animate-pulse mx-auto rounded-lg"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 auto-rows-[150px] md:auto-rows-[200px] grid-flow-dense">
        {skeletons.map((skel, i) => (
          <div
            key={i}
            className={`relative rounded-xl bg-black/5 animate-pulse overflow-hidden ${skel.colSpan} ${skel.rowSpan}`}
          />
        ))}
      </div>
    </div>
  );
}
