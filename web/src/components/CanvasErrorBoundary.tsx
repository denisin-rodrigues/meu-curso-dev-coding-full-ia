"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly fallback: ReactNode;
}

interface State {
  readonly hasError: boolean;
}

/** Isola falhas da cena 3D: se a <Canvas> quebrar, a UI 2D continua viva. */
export class CanvasErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Ponto para encaminhar a erro-reporter (ex: Sentry) no futuro.
    console.error("[CanvasErrorBoundary]", error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
