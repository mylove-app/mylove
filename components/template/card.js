"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/reusable/button";

export default function TemplateCard({ template }) {
  const router = useRouter();

  const truncate = (text, limit) =>
    text?.length > limit ? text.slice(0, limit) + "..." : text;

  return (
    <div className="relative overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col border border-gray-200 rounded-[8px]">
      <div className="aspect-[4/3] w-full overflow-hidden mb-2">
        <Image
          src={template.image?.[0] || "/no-image.png"}
          width={400}
          height={300}
          alt={template.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full flex-1 flex flex-col justify-between p-3">
        <div>
          <h4 className="font-semibold text-sm line-clamp-2">
            {truncate(template.name, 35)}
          </h4>
          <p className="text-xs text-slate-500 mb-1">
            {truncate(template.description, 50)}
          </p>

          {template.category && template.category.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {template.category.map((cat) => (
                <span
                  key={cat}
                  className="inline-block text-[11px] font-medium bg-primary/10 text-primary px-2 py-1 rounded-md"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="w-full mt-3 flex justify-end">
          <Button
            onClick={() =>
              router.push(`/template/${encodeURIComponent(template.id)}`)
            }
            label="lihat detail"
            fontWeight="semibold"
            py="py-2"
            px="px-3"
            textSize="text-xs"
          />
        </div>
      </div>
    </div>
  );
}
