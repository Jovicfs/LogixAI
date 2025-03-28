import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { Pencil, Square, Circle, Triangle, Type, Image, Trash, Menu } from 'lucide-react'; // Icon imports
import Header from './shared/Header';
import Footer from './shared/Footer';
import withProtectedRoute from './shared/ProtectedRoute';

function SmartEdit() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [activeObject, setActiveObject] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || fabricCanvas.current) return;

    const updateCanvasSize = () => {
      const container = containerRef.current;
      if (!container || !fabricCanvas.current) return;

      const padding = 32; // 2rem (px-4 py-8 = 16px * 2)
      const maxWidth =Math.min(container.offsetWidth - padding, 1024); //1024px max width
      const ratio = 3/4; // Standard aspect ratio
      const height = maxWidth * ratio;

      fabricCanvas.current.setDimensions({  
        width: maxWidth,
        height: height
      });
      fabricCanvas.current.renderAll();
    };

    fabricCanvas.current = new fabric.Canvas(canvasRef.current);
    updateCanvasSize();

    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      fabricCanvas.current?.dispose();
      fabricCanvas.current = null;
    };
  }, []);

  const addShape = (type) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    let shape;
    if (type === 'rectangle') {
      shape = new fabric.Rect({ width: 100, height: 100, fill: '#ff0000', left: 100, top: 100 });
    } else if (type === 'circle') {
      shape = new fabric.Circle({ radius: 50, fill: '#00ff00', left: 100, top: 100 });
    } else if (type === 'triangle') {
      shape = new fabric.Triangle({ width: 100, height: 100, fill: '#0000ff', left: 100, top: 100 });
    }
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  const addText = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    const text = new fabric.IText('Double click to edit', { left: 100, top: 100, fontSize: 20, fill: '#000000' });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        img.scaleToWidth(200);
        fabricCanvas.current.add(img);
        fabricCanvas.current.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const deleteSelected = () => {
    const canvas = fabricCanvas.current;
    if (!canvas || !activeObject) return;

    canvas.remove(activeObject);
    setActiveObject(null);
    canvas.renderAll();
  };
 
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main ref={containerRef} className="flex-grow container mx-auto px-4 py-8 mt-16 relative">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed left-4 top-20 z-50 bg-white p-2 rounded-full shadow-lg"
        >
          <Menu size={24} />
        </button>

        {/* Responsive Toolbar */}
        <div className={` 
          fixed left-0 top-20 z-30 bg-white shadow-md rounded-lg p-0
          md:left-4 md:block  
          ${isMobileMenuOpen ? 'block' : 'hidden'}
          transition-transform duration-200 ease-in-out
        `}>
          <div className="flex md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4 p-2">
            <button onClick={() => addShape('triangle')} className="p-2 rounded-md hover:bg-gray-100">
              <Triangle className="text-purple-600" size={24} />
            </button>
            <button onClick={() => addShape('rectangle')} className="p-2 rounded-md hover:bg-gray-100">
              <Square className="text-yellow-600" size={24} />
            </button>
            <button onClick={() => addShape('circle')} className="p-2 rounded-md hover:bg-gray-100">
              <Circle className="text-blue-500" size={24} />
            </button>
            <button onClick={addText} className="p-2 rounded-md hover:bg-gray-100">
              <Type className="text-purple-500" size={24} />
            </button>
            <input type="file" accept="image/*" onChange={handleImageUpload} id="imageUpload" className="hidden" />
            <label htmlFor="imageUpload" className="p-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <Image className="text-black" size={24} />
            </label>
            <button 
              onClick={deleteSelected} 
              disabled={!activeObject} 
              className="p-2 rounded-md hover:bg-red-100 disabled:opacity-50"
            >
              <Trash className="text-red-500" size={24} />
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="border border-gray-300 rounded-lg shadow-lg mx-auto overflow-hidden">
          <canvas ref={canvasRef} className="rounded-lg max-w-full" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default withProtectedRoute(SmartEdit);
