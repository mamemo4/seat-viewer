import { Box, Divider, Tooltip, Typography } from "@mui/material";
import { findSeatAssignment } from "./HelperFunctions"
import { AssignmentsTable } from "./AssignmentTable"; 

type SectionLayoutProps = {
  seats: number[][];
  sectionNumber: string;
  date: string;
  minRow: number;
  minSeat: number;
  seatColors: Record<string, string>;
};

// Hex color mapping for seat types
const seatColors: { [key: number]: string } = {
  1: "primary.main", // Blue - regular seat
  2: "#4caf50", // Green - special seat 2
  3: "#ff9800", // Orange - special seat 3
  4: "#f44336", // Red - special seat 4
  5: "#9c27b0", // Purple - special seat 5
};

// Descriptions for special seat types
const seatTypeLabels: { [key: number]: string } = {
  2: "ADA",
  3: "ADA Retractable",
  4: "Retractable",
  5: "Not Used During Wednesday Worship",
};

export const SectionLayout = ({
  seats,
  sectionNumber,
  date,
  minRow,
  minSeat,
  seatColors
}: SectionLayoutProps) => {
  const columns = seats[0].length;

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="h4">Section {sectionNumber}</Typography>
      {seats.map((row, rowIndex) => (
        <Box key={rowIndex} display="flex" alignItems="center" gap={1}>
          <Typography width={20}>
            {minRow + seats.length - rowIndex - 1}
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns={`repeat(${columns}, 30px)`}
            gap="4px"
          >
            {row.map((seat, colIndex) => {
              const rowNum = minRow + seats.length - rowIndex - 1;
              const seatNum = colIndex + minSeat;
              const seatNumber = `Row ${rowNum}, Seat ${seatNum}`;
              let tooltipTitle =
                seat > 1
                  ? `${seatNumber} (${seatTypeLabels[seat]})`
                  : seatNumber;

              //const color = seatColors[seatNum];
              const cong = findSeatAssignment(date, sectionNumber, rowNum, seatNum)[0];
              let color: string;
              if (cong) {
                color = seatColors[cong.congregationId];
                tooltipTitle = `Cong ID: ${cong.congregationId} - ${cong.congregationName} - ${tooltipTitle}`;

              }
              else {
                color = "#757575"
              }
              
              
              return seat !== 0 ? (
                <Tooltip title={tooltipTitle} key={seatNumber + "_TT"}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: color || "#9e9e9e", // fallback gray
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: color || "#757575",
                        cursor: "pointer",
                      },
                    }}
                  />
                </Tooltip>
              ) : (
                <Box key={seatNumber + "_Box"} sx={{ width: 30, height: 30 }} />
              );
            })}
          </Box>
        </Box>
      ))}
      <Typography>Row Number</Typography>
      <Typography align="center" variant="h6">
        Front of Section
      </Typography>

    <Divider/>
    <AssignmentsTable
              section={sectionNumber}
              date={date}
          />
    </Box>
    
  );
};
