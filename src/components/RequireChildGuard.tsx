import { useRouter } from "expo-router";
import React from "react";
import { EmptyState } from "../../src/components/EmptyState";
import { LoadingBaby } from "../../src/components/Loading";
import { useChild } from "../context/ChildContext";

export function RequireChildGuard({ children }: { children: React.ReactNode }) {
  const { childId, isLoadingChild } = useChild();
  const router = useRouter();

  if (isLoadingChild) {
    return <LoadingBaby message="Carregando perfil..." />;
  }

  if (!childId || childId === 0) {
    return (
      <EmptyState
        isFullPage={true}
        show404Background={false}
        title="Nenhum bebê selecionado!"
        description="Você precisa selecionar ou cadastrar um perfil para gerenciar isso."
        buttonText="Escolher Perfil"
        onButtonClick={() => router.push("/home")}
      />
    );
  }

  return <>{children}</>;
}
