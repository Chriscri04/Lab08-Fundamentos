import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Scale, Check, Plus } from 'lucide-react';
import type { Property } from '@/types/property';
import { toast } from 'sonner';

interface CompareButtonProps {
  property: Property;
}

/**
 * Componente CompareButton
 * Maneja la lógica de selección de propiedades para comparación (Máximo 3).
 */
export function CompareButton({ property }: CompareButtonProps): React.ReactElement {
  // Estado local para persistencia simple en este laboratorio
  const [isSelected, setIsSelected] = useState(false);

  // Clave para el localStorage
  const STORAGE_KEY = 'property_compare_list';

  // Sincronizar estado inicial con lo que haya en el storage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setIsSelected(saved.some((p: Property) => p.id === property.id));
  }, [property.id]);

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que se disparen eventos del padre (como el Link de la Card)
    
    const currentList: Property[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const isAlreadyInList = currentList.some((p) => p.id === property.id);

    if (isAlreadyInList) {
      // Lógica para REMOVER
      const newList = currentList.filter((p) => p.id !== property.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      setIsSelected(false);
      toast.info('Eliminada de la comparación');
    } else {
      // Lógica para AGREGAR (Validando el límite de 3)
      if (currentList.length >= 3) {
        toast.error('Solo puedes comparar un máximo de 3 propiedades');
        return;
      }
      
      const newList = [...currentList, property];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      setIsSelected(true);
      toast.success('Añadida a la comparación');
    }

    // Disparar un evento personalizado para que otros componentes (como la página) se enteren del cambio
    window.dispatchEvent(new Event('compareListUpdated'));
  };

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={handleToggleCompare}
      className={`flex items-center gap-2 transition-all duration-200 ${
        isSelected ? 'bg-primary text-primary-foreground' : 'hover:border-primary'
      }`}
    >
      {isSelected ? (
        <Check className="h-4 w-4 animate-in zoom-in duration-300" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      <Scale className="h-4 w-4 opacity-70" />
      <span>{isSelected ? 'En lista' : 'Comparar'}</span>
    </Button>
  );
}