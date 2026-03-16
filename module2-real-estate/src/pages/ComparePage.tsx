import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Property } from '@/types/property';
import { formatPrice, formatArea } from '@/lib/utils';

export function ComparePage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const loadProperties = () => {
      const saved = JSON.parse(localStorage.getItem('property_compare_list') || '[]');
      setProperties(saved);
    };

    loadProperties();
    // Escuchar cambios si el usuario abre otra pestaña o usa el botón
    window.addEventListener('compareListUpdated', loadProperties);
    return () => window.removeEventListener('compareListUpdated', loadProperties);
  }, []);

  const removeItem = (id: string) => {
    const newList = properties.filter(p => p.id !== id);
    localStorage.setItem('property_compare_list', JSON.stringify(newList));
    setProperties(newList);
    window.dispatchEvent(new Event('compareListUpdated'));
  };

  // Lógica para encontrar el "Mejor Valor" (Precio más bajo)
  const minPrice = Math.min(...properties.map(p => p.price));
  // Lógica para encontrar la "Mejor Área" (Más grande)
  const maxArea = Math.max(...properties.map(p => p.area));

  if (properties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No hay propiedades para comparar</h2>
        <p className="text-muted-foreground mb-8">Selecciona hasta 3 propiedades para ver sus diferencias aquí.</p>
        <Button asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold">Comparación de Propiedades</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
        {/* Etiquetas de las filas */}
        <div className="hidden md:flex flex-col gap-8 pt-[220px] font-semibold text-muted-foreground">
          <div className="h-12 flex items-center">Precio</div>
          <div className="h-12 flex items-center">Área</div>
          <div className="h-12 flex items-center">Habitaciones</div>
          <div className="h-12 flex items-center">Baños</div>
        </div>

        {/* Columnas de Propiedades */}
        <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${properties.length}, 1fr)` }}>
          {properties.map((prop) => (
            <Card key={prop.id} className="relative overflow-hidden border-2 transition-all">
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 z-10 h-8 w-8"
                onClick={() => removeItem(prop.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="h-40 overflow-hidden">
                <img src={prop.images?.[0]} alt={prop.title} className="w-full h-full object-cover" />
              </div>

              <CardContent className="p-4 flex flex-col gap-8">
                <h3 className="font-bold text-sm h-10 line-clamp-2">{prop.title}</h3>
                
                {/* Fila: Precio */}
                <div className={`h-12 flex items-center justify-between p-2 rounded-lg ${prop.price === minPrice ? 'bg-green-100 border-green-500 border text-green-700' : ''}`}>
                  <span className="font-bold">{formatPrice(prop.price)}</span>
                  {prop.price === minPrice && <CheckCircle2 className="h-4 w-4" />}
                </div>

                {/* Fila: Área */}
                <div className={`h-12 flex items-center justify-between p-2 rounded-lg ${prop.area === maxArea ? 'bg-blue-100 border-blue-500 border text-blue-700' : ''}`}>
                  <span>{formatArea(prop.area)}</span>
                  {prop.area === maxArea && <CheckCircle2 className="h-4 w-4" />}
                </div>

                {/* Fila: Habitaciones */}
                <div className="h-12 flex items-center">{prop.bedrooms}</div>

                {/* Fila: Baños */}
                <div className="h-12 flex items-center">{prop.bathrooms}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}