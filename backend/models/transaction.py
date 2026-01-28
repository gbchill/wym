from datetime import datetime
from decimal import Decimal
from dataclasses import dataclass

#this defines the shape of the data
@dataclass
class Transaction:
    date: datetime          # From "Posted Date" column
    description: str        # From "Payee" column
    amount: Decimal         # From "Amount" column
    reference_number: str   # From "Reference Number" column
    transaction_type: str   # "debit" or "credit" (you determine from amount)
    category: str = "uncategorized"  # Default, will be set later by categorizer
    @property
    def is_expense(self) -> bool:
        return self.amount < 0
    @property
    def is_income(self) -> bool:
        return self.amount > 0
    def __repr__(self): #tells python hOW to display your object as a string
        return (f"Transaction(date={self.date}, description='{self.description}', "
                f"amount={self.amount} "
                f"transaction_type='{self.transaction_type}', category='{self.category}')")