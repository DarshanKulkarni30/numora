import type { ActionPlan } from "@/lib/numerology/enhanced/actionPlan";

type Props = {
  plan: ActionPlan;
};

export function ActionPlanPanel({ plan }: Props) {
  return (
    <div>
      <p className="text-xs text-ink-soft">{plan.purposeNote}</p>
      {([plan.days30, plan.days90] as const).map((block) => (
        <div key={block.title} className="mt-4">
          <p className="font-medium text-ink">{block.title}</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-soft">
            {block.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      ))}
      <div className="mt-4">
        <p className="font-medium text-ink">{plan.year.title}</p>
        <p className="mt-1 text-sm text-ink">Primary: {plan.year.primary}</p>
        <p className="text-sm text-ink">Secondary: {plan.year.secondary}</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          {plan.year.items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
