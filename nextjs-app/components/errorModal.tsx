"use client"

import { FC, useEffect, useState } from 'react';
import { Modal, Button, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from '@heroui/react';
import { useModal } from '@/app/contexts/ModalContext';
import { useRouter } from 'next/navigation';

const ErrorModal: FC = () => {
  const { isOpen, onOpenChange, header, body, onConfirm, buttonText, inputPlaceholder } = useModal();
  const [currentHost, setCurrentHost] = useState<string>(typeof window !== 'undefined' ? window.location.origin : '');
  const [inputValueState, setInputValueState] = useState<string>('');
  const router = useRouter();
  
  useEffect(() => {
    setCurrentHost(typeof window !== 'undefined' ? window.location.origin : '');
  }, []);

  const login = async () => {
    window.location.reload();
  };

  const logout = async () => {
    router.push(`${currentHost}/openid-connect-auth/logout`);
  };

  const handleConfirm = (close: any) => {
    if (typeof onConfirm === "string") {
      switch(onConfirm) { 
        case "login": {
          login();
          break; 
        } 
        case "logout": {  
          logout();
          break; 
        }
      }
      close();
      return;
    }
    if (onConfirm)
        onConfirm(inputValueState);
    close();
  }

  return (
    <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} size='xs'scrollBehavior='inside'>
        <ModalContent>
        {(close) => (
        <>
            <ModalHeader className="flex flex-col gap-1">
                <h1>{header}</h1>
            </ModalHeader>
            <ModalBody>
                <p>{body}</p>
                {inputPlaceholder && (
                  <Input
                    name='comment_text'
                    type="text"
                    placeholder={inputPlaceholder}
                    value={inputValueState}
                    onChange={(e) => setInputValueState(e.target.value)}
                  />
                )}
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onPress={() => handleConfirm(close)}>
                { buttonText }
                </Button>
            </ModalFooter>
            </>
        )}
        </ModalContent>
    </Modal>
  );
};

export default ErrorModal;