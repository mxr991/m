function getEnumArray(TypeName) {
    var ar;
    if (TypeName == "DNK.Core.Transactions.EntryState") {
        ar = [
            { "val": "0", "name": "جديد" },
            { "val": "1", "name": "نجحت" },
            { "val": "2", "name": "معالجه" },
            { "val": "3", "name": "فشلت" },
            { "val": "4", "name": "قيد الإنتظار" },
            { "val": "-1", "name": "غير معروف" },
        ]
    }
    else if (TypeName == "DNK.Notifications.MassageState") {
        ar = [
            { "val": "0", "name": "غير معروف" },
            { "val": "11", "name": "وصلت" },
            { "val": "31", "name": "فشلت" },
            { "val": "10", "name": "تم الارسال" },
            { "val": "21", "name": "لم يتم الارسال" },
            { "val": "22", "name": "مقفله" },
            { "val": "1", "name": "تحت التنفيذ" },
            { "val": "30", "name": "رفضت" },
            { "val": "32", "name": "الخدمه غير متاحه" },
        ]
    }
    else {
        ar = []
    }
    return ar;
}



