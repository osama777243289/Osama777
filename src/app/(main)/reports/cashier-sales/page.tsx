
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSaleRecordById, SalesRecord } from '@/lib/firebase/firestore/sales';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Printer, Paperclip, Building, Calendar, Clock, User, Hash } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

function CashierSalesReportContent() {
  const searchParams = useSearchParams();
  const recordId = searchParams.get('id');
  const [record, setRecord] = useState<SalesRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recordId) {
      const fetchRecord = async () => {
        setLoading(true);
        setError(null);
        try {
          const fetchedRecord = await getSaleRecordById(recordId);
          if (fetchedRecord) {
            setRecord(fetchedRecord);
          } else {
            setError('لم يتم العثور على سجل المبيعات المحدد.');
          }
        } catch (err) {
          console.error('Failed to fetch sales record:', err);
          setError('حدث خطأ أثناء جلب بيانات السجل.');
        } finally {
          setLoading(false);
        }
      };
      fetchRecord();
    } else {
      setError('لم يتم توفير معرف سجل المبيعات.');
      setLoading(false);
    }
  }, [recordId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>خطأ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!record) {
    return null;
  }

  const companyInfo = {
    name: 'مؤسسة أسامة الخطيب',
    logo: '/logo.png'
  };

  const translatePeriod = (period: 'Morning' | 'Evening') => period === 'Morning' ? 'صباحية' : 'مسائية';


  return (
    <div className="space-y-6">
        <div className="flex justify-end items-center gap-2 print:hidden">
            <Button onClick={handlePrint} variant="default">
                <Printer className="ml-2 h-4 w-4" />
                طباعة التقرير
            </Button>
        </div>

        <Card className="printable-area p-4 md:p-8" id="report">
            <CardHeader className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Image src={companyInfo.logo} alt="Company Logo" width={180} height={40} />
                    </div>
                    <div className="text-left">
                        <CardTitle className="text-3xl font-bold">تقرير مبيعات الكاشير</CardTitle>
                        <p className="text-muted-foreground">معرف السجل: {record.id}</p>
                    </div>
                </div>
            </CardHeader>
            <Separator className="my-4" />
            <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div><span className="font-bold">التاريخ:</span> {format(record.date.toDate(), 'yyyy/MM/dd')}</div>
                    </div>
                     <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div><span className="font-bold">الفترة:</span> {translatePeriod(record.period)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div><span className="font-bold">الكاشير:</span> {record.cashier}</div>
                    </div>
                   {record.postingNumber && (
                     <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <div><span className="font-bold">رقم الترحيل:</span> {record.postingNumber}</div>
                    </div>
                   )}
                </div>

                <div className="space-y-6">
                    {/* Cash Sales */}
                    {record.cash && record.cash.amount > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2 border-b pb-2">المبيعات النقدية</h3>
                            <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                                <span>{record.cash.accountName}</span>
                                <span className="font-mono font-bold text-lg">{record.cash.amount.toFixed(2)} ر.س</span>
                            </div>
                        </div>
                    )}

                    {/* Card Sales */}
                    {record.cards && record.cards.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2 border-b pb-2">مبيعات الشبكة/البطاقة</h3>
                            <div className="space-y-2">
                            {record.cards.map((card, index) => (
                                <div key={index} className="flex justify-between items-start p-2 bg-muted/50 rounded-md">
                                    <div>
                                        <span>{card.accountName}</span>
                                        {card.receiptImageUrl && (
                                            <a href={card.receiptImageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline text-xs mt-1 print-receipt-image">
                                                <Paperclip className="h-3 w-3" />
                                                <span>عرض الإيصال المرفق</span>
                                            </a>
                                        )}
                                    </div>
                                    <span className="font-mono font-bold text-lg">{card.amount.toFixed(2)} ر.س</span>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}

                    {/* Credit Sales */}
                    {record.credits && record.credits.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2 border-b pb-2">المبيعات الآجلة (ذمم)</h3>
                             <div className="space-y-2">
                            {record.credits.map((credit, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                                    <span>{credit.accountName}</span>
                                    <span className="font-mono font-bold text-lg">{credit.amount.toFixed(2)} ر.س</span>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
            <Separator className="my-4" />
            <CardFooter className="p-4 flex justify-end">
                <div className="text-right">
                    <p className="text-muted-foreground">الإجمالي الكلي للمبيعات</p>
                    <p className="text-3xl font-bold text-primary">{record.total.toFixed(2)} ر.س</p>
                </div>
            </CardFooter>
        </Card>
    </div>
  );
}

export default function CashierSalesReportPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
            <CashierSalesReportContent />
        </Suspense>
    )
}
