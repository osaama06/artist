import ExhibitionForm from "@/components/admin/ExhibitionForm";
import { createExhibition } from "../actions";

export const metadata = { title: "معرض جديد | لوحة التحكم" };

export default function NewExhibitionPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">معرض جديد</h1>
      <ExhibitionForm action={createExhibition} />
    </div>
  );
}
