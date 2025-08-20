package services

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

// SerialNumberService handles serial number operations
type SerialNumberService struct {
	app *pocketbase.PocketBase
}

// NewSerialNumberService creates a new SerialNumberService
func NewSerialNumberService(app *pocketbase.PocketBase) *SerialNumberService {
	return &SerialNumberService{app: app}
}

// BulkInsertFromCSV imports serial numbers from a CSV file
func (s *SerialNumberService) BulkInsertFromCSV(filePath string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("failed to open file %s: %w", filePath, err)
	}
	defer file.Close()

	reader := csv.NewReader(file)

	collection, err := s.app.FindCollectionByNameOrId("serial_numbers")
	if err != nil || collection == nil {
		return fmt.Errorf("serial_numbers collection not found: %w", err)
	}

	return s.app.RunInTransaction(func(txApp core.App) error {
		for {
			record, err := reader.Read()
			if err == io.EOF {
				break
			}
			if err != nil {
				return fmt.Errorf("failed to read CSV: %w", err)
			}

			if len(record) != 2 {
				continue // Skip invalid records
			}

			serialNumber := strings.TrimSpace(record[0])
			insuranceValue := strings.TrimSpace(strings.ToLower(record[1]))
			isInsurance := insuranceValue == "true" || insuranceValue == "1" || insuranceValue == "yes"

			dbRecord := core.NewRecord(collection)
			dbRecord.Load(map[string]interface{}{
				"serial_number": serialNumber,
				"is_insurance":  isInsurance,
			})

			if err := txApp.Save(dbRecord); err != nil {
				return fmt.Errorf("failed to save record: %w", err)
			}
		}
		return nil
	})
}
