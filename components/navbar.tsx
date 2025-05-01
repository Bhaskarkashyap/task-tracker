"use client";

import React from "react";
import { UserNav } from "./user-nav";
import { Button } from "@/components/ui/button";

import { PlusCircle } from "lucide-react";

interface NavbarProps {
  projectLength?: boolean;
  user: { name: string; email: string } | null;
  setDialog?: any;
}

const Navbar = ({ user, projectLength, setDialog }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-10 border-b">
      <div className="flex h-16 items-center px-4 sm:px-6 justify-between ">
        <h1 className="font-bold text-xl">PROJECTS</h1>
        <div className="flex gap-5">
          <Button
            onClick={() => setDialog(true)}
            disabled={!projectLength}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Project
          </Button>
          <div className="ml-auto flex items-center space-x-4">
            {user && <UserNav user={user} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
