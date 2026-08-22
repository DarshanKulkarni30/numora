import { LayeredNote } from "@/components/report/LayeredNote";

type PathStoryProps = {
  feel: string;
  atmosphere: string;
  invitation: string;
  looksLike?: string;
  helps?: string[];
  watch?: string[];
  student?: string;
  expert?: string;
  dark?: boolean;
};

export function PathStory({
  feel,
  atmosphere,
  invitation,
  looksLike,
  helps,
  watch,
  student,
  expert,
  dark,
}: PathStoryProps) {
  const label = dark ? "text-sand" : "text-ink";
  const muted = dark ? "text-paper/85" : "text-ink-soft";

  return (
    <div>
      <dl className={`space-y-2.5 text-xs leading-5 ${muted}`}>
        <div>
          <dt className={label}>In simple words</dt>
          <dd className="mt-0.5">{feel}</dd>
        </div>
        {looksLike ? (
          <div>
            <dt className={label}>What this can look like</dt>
            <dd className="mt-0.5">{looksLike}</dd>
          </div>
        ) : null}
        {helps && helps.length ? (
          <div>
            <dt className={label}>What can help</dt>
            <dd className="mt-0.5">
              <ul className="list-disc space-y-1 pl-4">
                {helps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
        {watch && watch.length ? (
          <div>
            <dt className={label}>What to watch</dt>
            <dd className="mt-0.5">
              <ul className="list-disc space-y-1 pl-4">
                {watch.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
        <div>
          <dt className={label}>Where it shows up</dt>
          <dd className="mt-0.5">{atmosphere}</dd>
        </div>
        <div>
          <dt className={label}>Something you can try</dt>
          <dd className="mt-0.5">{invitation}</dd>
        </div>
      </dl>
      <LayeredNote dark={dark} student={student} expert={expert} />
    </div>
  );
}
