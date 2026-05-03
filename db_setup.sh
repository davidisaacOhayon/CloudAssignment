

# Variables
INSTANCE_NAME="backenddb"
DB_NAME="backend"
DB_USER="backend"
DB_PASSWORD="1yEDbOF7tiykWIMNhVEwGa5u"
REGION="europe-west1"

gcloud sql instances create $INSTANCE_NAME \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=$REGION

gcloud sql databases create $DB_NAME \
  --instance=$INSTANCE_NAME


gcloud sql users create $DB_USER \
  --instance=$INSTANCE_NAME \
  --password=$DB_PASSWORD

echo "database setup complete"
