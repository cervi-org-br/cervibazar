"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as Lucide from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { useSalesHistory } from "@/app/hooks/useSalesHistory";

export default function HistoricoClientPage() {
  const router = useRouter();
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clientName,
    clientPhone,
    setClientName,
    setClientPhone,
    sellerId,
    setSellerId,
    sellerOptions,
    loadingUsers,
    sales,
    loading,
    totalOfPeriod,
    totalsByPayment,
    totalToday,
    deleteOpen,
    deleting,
    openDelete,
    cancelDelete,
    confirmDelete,
    handleExport,
    formatSaleDate,
    highlightedDays,
    holidays,
  } = useSalesHistory();

  const formatCurrency = (value: number) => {
    if (!Number.isFinite(value)) return "R$ 0,00";
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const isPositiveAmount = (value?: string | number | null) => {
    const num = Number(value);
    return Number.isFinite(num) && num > 0;
  };

  const renderPaymentChip = (
    label: string,
    value?: string | number | null,
    className?: string
  ) => {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return null;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${className ?? "bg-muted/70"}`}
      >
        {label}:{" "}
        <strong className="text-text-main dark:text-white">{formatCurrency(num)}</strong>
      </span>
    );
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors duration={2000} />
      <div className="space-y-3">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
            Histórico de Vendas
          </h2>
          <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
            Consulte as vendas por período e visualize os detalhes.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nome do cliente"
            className="w-full md:w-[220px]"
          />
          <Input
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="Telefone do cliente"
            inputMode="tel"
            className="w-full md:w-[200px]"
          />
          <div className="min-w-[200px]">
            <Select
              value={sellerId}
              onChange={(event) => setSellerId(event.target.value)}
              options={sellerOptions}
              placeholder={loadingUsers ? "Carregando..." : "Selecione o vendedor"}
              disabled={loadingUsers}
            />
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              highlightedDays={highlightedDays}
              holidays={holidays}
              buttonClassName="h-11 w-full px-4 md:w-[160px]"
            />
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              highlightedDays={highlightedDays}
              holidays={holidays}
              buttonClassName="h-11 w-full px-4 md:w-[160px]"
            />
          </div>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-secondary">Vendas do período</p>
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
            <span className="inline-flex h-[32px] items-center rounded-full bg-secondary/20 px-3 py-1 text-text-main leading-none dark:text-white">
              {sales.length} venda(s)
            </span>
            <span className="inline-flex h-[32px] items-center rounded-full bg-primary/10 px-3 py-1 text-primary leading-none">
              Total: {formatCurrency(totalOfPeriod)}
            </span>
            <span className="inline-flex h-[32px] items-center rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600 leading-none dark:text-emerald-300">
              Total hoje: {formatCurrency(totalToday)}
            </span>
            <Button
              variant="outline"
              onClick={handleExport}
              className="h-[32px] gap-2 rounded-full p-0 text-xs font-bold leading-none"
              disabled={loading || sales.length === 0}
              title="Exportar o resultado atual"
            >
              <Lucide.Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-secondary dark:text-[#bcaec4]">
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
              Crédito:{" "}
              <strong className="text-text-main dark:text-white">
                {formatCurrency(totalsByPayment.credit)}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300">
              Débito:{" "}
              <strong className="text-text-main dark:text-white">
                {formatCurrency(totalsByPayment.debit)}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              Dinheiro:{" "}
              <strong className="text-text-main dark:text-white">
                {formatCurrency(totalsByPayment.cash)}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 bg-sky-500/10 text-sky-700 dark:text-sky-300">
              Pix:{" "}
              <strong className="text-text-main dark:text-white">
                {formatCurrency(totalsByPayment.pix)}
              </strong>
            </span>
          </div>
        </div>
        <div className="mt-3">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((key) => (
                <div
                  key={key}
                  className="h-12 animate-pulse rounded-xl bg-muted/60 dark:bg-background-dark/60"
                />
              ))}
            </div>
          ) : sales.length === 0 ? (
            <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm font-semibold text-text-secondary dark:border-[#452b4d] dark:bg-background-dark/40">
              Nenhuma venda encontrada para o período selecionado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead className="text-center">Total de Itens</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                  <TableHead className="text-right">&nbsp;</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => {
                  const createdAt = new Date(sale.createdAt);
                  const dateLabel = formatSaleDate(sale.saleDate);
                  const timeLabel = createdAt.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <TableRow
                      key={sale.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/historico/${encodeURIComponent(sale.id)}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Lucide.Calendar className="h-4 w-4 text-text-secondary" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-text-main dark:text-white">
                              {dateLabel}
                            </span>
                            <span className="text-xs text-text-secondary">às {timeLabel}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-text-secondary dark:text-[#bcaec4]">
                        {sale.clientName ?? "N/D"}
                      </TableCell>
                      <TableCell className="text-sm text-text-secondary dark:text-[#bcaec4]">
                        {sale.clientPhone ?? "N/D"}
                      </TableCell>
                      <TableCell className="text-text-secondary dark:text-[#bcaec4]">
                        {sale.sellerName ?? "N/D"}
                      </TableCell>
                      <TableCell className="text-center font-bold text-text-main dark:text-white">
                        {sale.totalItems}
                      </TableCell>
                      <TableCell className="font-bold text-text-main dark:text-white">
                        {formatCurrency(Number(sale.totalAmount))}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-text-secondary dark:text-[#bcaec4]">
                          {renderPaymentChip(
                            "Crédito",
                            sale.creditAmount,
                            "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                          )}
                          {renderPaymentChip(
                            "Débito",
                            sale.debitAmount,
                            "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          )}
                          {renderPaymentChip(
                            "Dinheiro",
                            sale.cashAmount,
                            "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          )}
                          {renderPaymentChip(
                            "Pix",
                            sale.pixAmount,
                            "bg-sky-500/10 text-sky-700 dark:text-sky-300"
                          )}
                          {!isPositiveAmount(sale.creditAmount) &&
                            !isPositiveAmount(sale.debitAmount) &&
                            !isPositiveAmount(sale.cashAmount) &&
                            !isPositiveAmount(sale.pixAmount) && (
                              <span className="text-text-secondary dark:text-[#bcaec4]">-</span>
                            )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end !gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="!m-0.5 !h-9 !w-9 !gap-0 !p-2 !rounded-full border border-border shadow-sm"
                            aria-label="Ver venda"
                            style={{ cursor: "pointer" }}
                          >
                            <Lucide.FileText className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="!m-0.5 !h-9 !w-9 !p-2 !rounded-full border border-red-200 text-red-600 shadow-sm hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
                            aria-label="Excluir venda"
                            style={{ cursor: "pointer" }}
                            onClick={(event) => {
                              event.stopPropagation();
                              openDelete(sale);
                            }}
                          >
                            <Lucide.Trash2 className="h-5 w-5 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        title="Remover venda"
        description="Tem certeza que deseja remover esta venda?"
        confirmLabel="Excluir"
        confirmTone="danger"
        loading={deleting}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
