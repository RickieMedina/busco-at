import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";


interface ConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
  }
  
export default function ConfirmDialog({ isOpen, onConfirm, onCancel, message } : ConfirmDialogProps){
    
return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
        <Button onClick={onCancel} variant="outline">Cancelar</Button>
        <Button onClick={onConfirm}>Confirmar</Button>
        </DialogFooter>
    </DialogContent>
    </Dialog>
);
};

