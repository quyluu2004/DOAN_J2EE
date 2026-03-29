import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { X, Edit2 } from 'lucide-react';

const Annotation = ({ annotation, yOffset }) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateAnnotation = useStore((s) => s.updateAnnotation);
  const removeAnnotation = useStore((s) => s.removeAnnotation);

  const handleDrag = (e) => {
    // Basic dragging logic could be added here if needed
    // For now, let's keep it simple with click-to-edit
  };

  return (
    <Html position={[annotation.position[0], yOffset + 0.5, annotation.position[1]]} center>
      <div className="group relative bg-white/90 backdrop-blur-sm border-2 border-[#775a19]/30 p-2 rounded-lg shadow-sm hover:border-[#775a19] transition-all cursor-move min-w-[60px]">
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={annotation.text}
            onChange={(e) => updateAnnotation(annotation.id, { text: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="bg-transparent border-none outline-none text-xs font-bold text-[#131313] w-full"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#131313] whitespace-nowrap">{annotation.text || 'Ghi chú...'}</span>
            <div className="hidden group-hover:flex items-center gap-1">
              <button onClick={() => setIsEditing(true)} className="p-0.5 hover:bg-gray-100 rounded text-gray-500">
                <Edit2 size={10} />
              </button>
              <button onClick={() => removeAnnotation(annotation.id)} className="p-0.5 hover:bg-red-50 rounded text-red-500">
                <X size={10} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Html>
  );
};

export default Annotation;
