import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { Pencil, Square, Circle, Triangle, Type, Image, Trash } from 'lucide-react'; // Icon imports
import Header from './shared/Header';
import Footer from './shared/Footer';
import withProtectedRoute from './shared/ProtectedRoute';

function SmartEdit() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [activeObject, setActiveObject] = useState(null);

  useEffect(() => {
    if (!canvasRef.current || fabricCanvas.current) return;

    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    const canvas = fabricCanvas.current;

    canvas.on('selection:created', (e) => setActiveObject(e.target));
    canvas.on('selection:cleared', () => setActiveObject(null));

    return () => {
      canvas.dispose();
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
      <main className="flex-grow container mx-auto px-4 py-8 mt-16 flex">
        {/* Sidebar Toolbar */}
        <div className="flex flex-col items-center space-y-4 bg-white shadow-md rounded-lg p-2 fixed left-4 top-20">
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
          <button onClick={deleteSelected} disabled={!activeObject} className="p-2 rounded-md hover:bg-red-100">
            <Trash className="text-red-500" size={24} />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="border border-gray-300 rounded-lg shadow-lg mx-auto">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default withProtectedRoute(SmartEdit);
