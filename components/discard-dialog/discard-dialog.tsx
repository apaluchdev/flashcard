import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

interface SimpleComponentProps {
  onCancel: Function;
  onDiscard: Function;
}

const DiscardDialog: React.FC<SimpleComponentProps> = ({
  onCancel,
  onDiscard,
}) => {
  function handleCancel() {
    onCancel();
  }
  function handleDiscard() {
    onDiscard();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button onClick={handleCancel} variant="outline">
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
          <AlertDialogDescription>
            Your current changes will be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDiscard}>Discard</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DiscardDialog;
