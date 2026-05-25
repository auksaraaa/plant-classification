const Footer = ({ className = "" }: { className?: string }) => (
  <footer className={`border-t bg-secondary/50 mt-16 ${className}`}>
    <div className="container py-10">
      <div className="text-center text-sm text-muted-foreground">
        © 2026 Kasetsart University. All Rights Reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
