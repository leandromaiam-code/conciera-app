import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subMonths, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

export const MonthSelector = ({ selectedMonth, onMonthChange }: MonthSelectorProps) => {
  // Gerar últimos 6 meses
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(startOfMonth(new Date()), i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy', { locale: ptBR }),
      date: date
    };
  });

  return (
    <div className="flex items-center gap-xs">
      <span className="text-sm text-grafite">Período:</span>
      <Select
        value={format(selectedMonth, 'yyyy-MM')}
        onValueChange={(value) => {
          const month = months.find(m => m.value === value);
          if (month) {
            onMonthChange(month.date);
          }
        }}
      >
        <SelectTrigger className="w-[180px] h-9 bg-branco border-cinza-borda">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label.charAt(0).toUpperCase() + month.label.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
