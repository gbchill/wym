import sys
import pandas as pd
from pathlib import Path
from typing import List
from decimal import Decimal
from datetime import datetime

sys.path.append(str(Path(__file__).parent.parent))
from models.transaction import Transaction


def parse_credit_card(file_path: str) -> List[Transaction]:
    """
    The function will read the CSV file and convert each row into a Transaction object
    Args:
    file_path (str): The path to the credit card CSV file
        Returns:Transaction: A list of Transaction objects parsed from the CSV file
    """
    if not Path(file_path).is_file():
        raise FileNotFoundError(f"The file {file_path} does not exist.") #check if file exists


    #read CSV into DataFrame
    df = pd.read_csv(file_path)

    # Create empty list for Transaction objects
    transactions = []

    # Loop through each row in the CSV
    for index, row in df.iterrows():
        
        # Convert date string "01/19/2026" to datetime object
        date = datetime.strptime(row['Posted Date'], '%m/%d/%Y')
        
        #get merchant name
        description = row['Payee']
        
        #convert amount to Decimal (precise for money calculations)
        amount = Decimal(row['Amount'])
        
        # get transaction ID from bank
        reference_number = str(row['Reference Number'])
        
        # negative amount = debit (spent), Positive = credit (refund/payment)
        transaction_type = 'debit' if amount < 0 else 'credit'

        # Create Transaction object from extracted data
        transaction = Transaction(
            date=date,
            description=description,
            amount=amount,
            reference_number=reference_number,
            transaction_type=transaction_type
        )
        
        # add to list
        transactions.append(transaction)

    # return all parsed transactions
    return transactions

    
if __name__ == "__main__":
    print("=" * 60)
    print("TESTING CREDIT CARD PARSER")
    print("=" * 60)
    script_dir = Path(__file__).parent  # gets the parsers directory
    project_root = script_dir.parent.parent  # Goes up to wym directory
    file_path = project_root / "data" / "raw" / "credit_card" / "credit_card_transactions.csv"

    result = parse_credit_card(file_path)

    print(f"\n Returned: {result}")







