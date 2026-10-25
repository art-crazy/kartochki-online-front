"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { AuthScreen } from "./types";
import {
  clearRegisterVerificationSnapshot,
  loadRegisterVerificationSnapshot,
  readRegisterVerificationSnapshot,
  saveRegisterVerificationSnapshot,
} from "./registerVerificationStorage";

// Restoration happens once per mount. Subsequent edits belong to this form.
const subscribe = () => () => {};
const getServerSnapshot = () => undefined;

export function useRegisterVerificationState() {
  const storedSnapshot = useSyncExternalStore(subscribe, readRegisterVerificationSnapshot, getServerSnapshot);
  const [restored, setRestored] = useState(false);
  const [screen, setScreen] = useState<AuthScreen>("login");
  const [verificationId, setVerificationId] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCodeLength, setVerificationCodeLength] = useState(6);
  const [verificationExpiresAt, setVerificationExpiresAt] = useState<number | null>(null);
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null);

  // The server snapshot keeps hydration consistent. Adopt browser storage before
  // committing the client render, rather than cascading updates from an effect.
  if (!restored && storedSnapshot !== undefined) {
    setRestored(true);
    const snapshot = loadRegisterVerificationSnapshot(storedSnapshot);
    if (snapshot) {
      setVerificationId(snapshot.verificationId);
      setVerificationEmail(snapshot.email);
      setVerificationCodeLength(snapshot.codeLength);
      setVerificationExpiresAt(snapshot.expiresAt);
      setResendAvailableAt(snapshot.resendAvailableAt);
      setScreen("register-verify");
    }
  }

  useEffect(() => {
    // Never erase the saved verification during the initial hydration render.
    if (!restored) return;
    if (screen !== "register-verify" || !verificationId) {
      clearRegisterVerificationSnapshot();
      return;
    }
    saveRegisterVerificationSnapshot({
      email: verificationEmail,
      codeLength: verificationCodeLength,
      verificationId,
      expiresAt: verificationExpiresAt,
      resendAvailableAt,
    });
  }, [restored, resendAvailableAt, screen, verificationCodeLength, verificationEmail, verificationExpiresAt, verificationId]);

  return {
    screen, setScreen,
    verificationId, setVerificationId,
    verificationEmail, setVerificationEmail,
    verificationCodeLength, setVerificationCodeLength,
    verificationExpiresAt, setVerificationExpiresAt,
    resendAvailableAt, setResendAvailableAt,
  };
}
