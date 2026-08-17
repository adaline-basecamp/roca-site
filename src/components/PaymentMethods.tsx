import { PAYMENT_METHODS } from "@/lib/constants";
import DropBullet from "@/components/motion/DropBullet";

type PaymentMethodsProps = {
  className?: string;
};

export default function PaymentMethods({ className = "" }: PaymentMethodsProps) {
  return (
    <div className={className}>
      <p className="eyebrow text-muted/80">
        Payment Methods Accepted
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {PAYMENT_METHODS.map((method, i) => (
          <div
            key={method.name}
            className="rounded-xl bg-white p-4 ring-1 ring-line"
          >
            <DropBullet
              className="h-6 w-6"
              outlineClassName="text-navy-900/20"
              delay={i * 0.08}
            />
            <h3 className="mt-2 text-sm font-bold text-navy-900">
              {method.name}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {method.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
